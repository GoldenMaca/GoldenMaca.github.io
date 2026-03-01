import os
import shutil
import sys
import random

#!/usr/bin/env python3
"""
hupitypo.py - create hidden nested folders in ~/Downloads and move user-specified items into random hidden slots.
After moving each item the script prints a "password" composed of the outer and inner folder numbers (e.g. "3-7").
"""

def expand(p): return os.path.abspath(os.path.expanduser(p))

def make_structure(downloads, n_outer, n_inner):
    for i in range(n_outer):
        outer = os.path.join(downloads, f".{i}")
        os.makedirs(outer, exist_ok=True)
        for j in range(n_inner):
            inner = os.path.join(outer, f".{j}")
            os.makedirs(inner, exist_ok=True)

def unique_dest(dst_dir, name):
    base, ext = os.path.splitext(name)
    candidate = name
    k = 1
    while os.path.exists(os.path.join(dst_dir, candidate)):
        candidate = f"{base}({k}){ext}"
        k += 1
    return os.path.join(dst_dir, candidate)

def move_items(paths, downloads, n_outer, n_inner):
    results = []
    for p in paths:
        p = expand(p)
        if not os.path.exists(p):
            results.append((p, None, f"NOT FOUND"))
            continue
        oi = random.randrange(n_outer)
        ii = random.randrange(n_inner)
        dst_dir = os.path.join(downloads, f".{oi}", f".{ii}")
        os.makedirs(dst_dir, exist_ok=True)
        name = os.path.basename(p)
        dst = unique_dest(dst_dir, name)
        try:
            shutil.move(p, dst)
            password = f"{oi}-{ii}"
            results.append((p, dst, password))
        except Exception as e:
            results.append((p, None, f"ERROR: {e}"))
    return results

def gather_paths_from_input():
    if len(sys.argv) > 1:
        return sys.argv[1:]
    print("Enter paths to move, one per line. Blank line to finish:")
    paths = []
    while True:
        try:
            line = input().strip()
        except EOFError:
            break
        if not line:
            break
        paths.append(line)
    return paths

def main():
    downloads = expand("~/Downloads")
    if not os.path.isdir(downloads):
        print(f"Downloads directory not found at {downloads}")
        return
    try:
        n_outer = int(input("Number of outer hidden folders to create (e.g. 10): ").strip() or "10")
        n_inner = int(input("Number of inner hidden folders per outer (e.g. 10): ").strip() or "10")
    except ValueError:
        print("Invalid number.")
        return
    make_structure(downloads, n_outer, n_inner)
    paths = gather_paths_from_input()
    if not paths:
        print("No paths provided; exiting.")
        return
    results = move_items(paths, downloads, n_outer, n_inner)
    for src, dst, info in results:
        if dst:
            print(f"MOVED: {src} -> {dst}  PASSWORD: {info}")
        else:
            print(f"FAILED: {src}  {info}")

if __name__ == "__main__":
    main()