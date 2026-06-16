## Maintainers

### Requirements

- [pnpm](https://pnpm.io/installation)
- [just](https://github.com/casey/just)

### Generate bindings

1. Install dependencies

```bash
pnpm install
```

2. Update `VERSION` in `justfile` and run:

```bash
just release
```

3. Generate bindings

```bash
just generate
```

4. Update Changelog

[CHANGELOG.md](CHANGELOG.md)

5. Create `release/v{version}` branch and PR

Release workflow will take care of the rest.