# Mulago Foundation Portfolio

This repo distributes a dataset of organizations in the [Mulago Foundation's](https://www.mulagofoundation.org) portfolio. It's a nice, interesting, sufficiently complex dataset to use in demos, practice, etc.

Data was collected from the Mulago Foundation's public website, and all data belongs to the Mulago Foundation.


## Usage

### Via npm

```bash
npm i @alexvipond/mulago-foundation-portfolio
```

To import detailed organization profiles:

```ts
// Import detailed organization profiles
import { portfolio } from '@alexvipond/mulago-foundation-portfolio'

// Or, for simpler use cases, reduce bundle size by just importing
// organization names:
import { names } from '@alexvipond/mulago-foundation-portfolio'
```


### Fetching

```js
fetch(...)
```

