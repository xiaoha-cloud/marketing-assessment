# Contributing

## Developer Certificate of Origin (DCO)

This project uses the [Developer Certificate of Origin](https://developercertificate.org/). Every commit must include a `Signed-off-by` trailer that matches the commit author.

Use the `-s` / `--signoff` flag when committing:

```bash
git commit -s -m "feat: describe your change"
```

That appends:

```text
Signed-off-by: Your Name <your.email@example.com>
```

Use the same name and email as in `git config user.name` and `git config user.email`. By signing off, you certify the DCO terms for that contribution.

If you forgot to sign off on the last commit:

```bash
git commit --amend --no-edit -s
```

For several commits on a branch (before opening a PR):

```bash
git rebase main -x "git commit --amend --no-edit -s"
```

(Replace `main` with the appropriate base branch.)
