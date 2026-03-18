## Maintainers

### Requirements

- [pnpm](https://pnpm.io/installation)
- [just](https://github.com/casey/just)

### Generate bindings

1. Install dependencies

```bash
pnpm install
```

2. Generate

```bash
just generate
```

3. Bump version in `package.json`

4. Create `release/v{version}` branch and PR

Release workflow will take care of the rest.