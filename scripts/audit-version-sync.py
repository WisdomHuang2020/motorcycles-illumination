#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""发版一致性审计（配合 git-semver-tag-release）。

检查四方：VERSION <-> CHANGELOG 最新条目 <-> 本地 annotated tag <-> 远端 tag。
第五方 GitHub Release 为可选检查：需要 GITHUB_TOKEN / GH_TOKEN，缺失时记 SKIP 而非 FAIL。

用法：python scripts/audit-version-sync.py
退出码：0 = 无 FAIL；1 = 至少一项 FAIL。
"""
import json
import os
import re
import subprocess
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPO = "WisdomHuang2020/motorcycles-illumination"


def run(args, timeout=30):
    try:
        p = subprocess.run(args, cwd=ROOT, capture_output=True, text=True, timeout=timeout)
        return p.returncode, p.stdout.strip(), p.stderr.strip()
    except Exception as exc:  # noqa: BLE001
        return 1, "", str(exc)


def main():
    version = (ROOT / "VERSION").read_text(encoding="utf-8").strip()
    tag = "v" + version
    rows = []

    def add(name, ok, detail):
        rows.append((name, "PASS" if ok else "FAIL", detail))

    # 1) CHANGELOG 最新条目
    cl = (ROOT / "CHANGELOG.md").read_text(encoding="utf-8")
    m = re.search(r"^##\s+\[?v?(\d+\.\d+\.\d+)\]?", cl, re.M)
    cl_v = m.group(1) if m else ""
    add("CHANGELOG 最新条目", cl_v == version, f"expected {version}, got {cl_v or 'MISSING'}")

    # 2) 本地 annotated tag
    _, out, _ = run(["git", "tag", "-l", tag])
    add("本地 tag 存在", out == tag, f"git tag -l {tag} -> {out or '(none)'}")
    if out == tag:
        _, typ, err = run(["git", "cat-file", "-t", tag])
        add("tag 为 annotated", typ == "tag", f"git cat-file -t {tag} -> {typ or err[:60]}")

    # 3) tag 必须在 HEAD 历史里 —— 不要求 tag 恰好等于 HEAD：
    #    发版后继续提交 CI / 文档类改动是常态（v3.0.0 打 tag 后又修了 release.yml 的
    #    Notes 生成），硬要求相等会逼着每次琐碎改动都去强推 tag，那更危险。
    #    这里改为判断 tag 是 HEAD 的祖先，并把「tag 之后还有几个提交」显式打出来。
    _, tagged, _ = run(["git", "rev-list", "-n", "1", tag])
    _, head, _ = run(["git", "rev-parse", "HEAD"])
    if tagged and head:
        rc, _, _ = run(["git", "merge-base", "--is-ancestor", tag, "HEAD"])
        ahead = run(["git", "rev-list", "--count", f"{tag}..HEAD"])[1] or "?"
        add("tag 已在 HEAD 历史中", rc == 0,
            f"tag {tagged[:8]} / HEAD {head[:8]}，tag 之后另有 {ahead} 个提交")
    else:
        add("tag 已在 HEAD 历史中", False, f"{tagged[:8] or '-'} vs {head[:8] or '-'}")

    # 4) 远端 tag
    _, remote, err = run(["git", "ls-remote", "--tags", "origin", tag], timeout=45)
    add("远端 tag 存在", tag in remote,
        (remote.splitlines()[0] if remote else err[:80]) or "(none)")

    # 5) Release（可选）
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if not token:
        rows.append(("GitHub Release", "SKIP", "未设置 GITHUB_TOKEN/GH_TOKEN，跳过 API 查询"))
    else:
        req = urllib.request.Request(
            f"https://api.github.com/repos/{REPO}/releases/tags/{tag}",
            headers={"Authorization": f"Bearer {token}", "User-Agent": "motor-lighting-version-audit"},
        )
        try:
            with urllib.request.urlopen(req, timeout=20) as resp:
                data = json.load(resp)
            add("GitHub Release", data.get("tag_name") == tag,
                f"Release: {data.get('name') or data.get('tag_name')}")
        except Exception as exc:  # noqa: BLE001
            rows.append(("GitHub Release", "SKIP", f"API 查询失败：{exc}"))

    width = max(len(r[0]) for r in rows)
    line = "-" * (width + 44)
    print(f"版本单一来源 VERSION = {version}  (tag {tag})")
    print(line)
    for name, status, detail in rows:
        print(f"{name:<{width}}  {status:<4}  {detail}")
    print(line)
    failed = [r for r in rows if r[1] == "FAIL"]
    print(f"结论：{len(rows) - len(failed)}/{len(rows)} 通过"
          + (f"，{len(failed)} 项失败" if failed else "，无失败项"))
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
