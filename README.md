# contentful-entry-removal
Remove entries in Contentful space.

## Use
```
index.js --config ./config.json.example
```

## Command line options:
```
Options:
  --managementToken  Mangment token to space API
  --space            Space id to work with
  --maxAmount        Contentul API limit                         [default: 10]
  --interval         Contentful API calls timeout                [default: 5000]
  --config           Path to JSON config file                    [required]
```