### Server-driven UI

#### Cards

| key | value |
| --- | ----- |
| component | `Card` |
| title | title of the card |
| body | optional, body of the card |
| backgroundColor | optional, background color of the color, defaults to `#FFFFFF` |
| icon | optional, icon of the card |
| externalLink | optional, if specified, display the card as an external link and open the link in a browser when tapped |
| deepLink | optional, if specified, deep link to a specific screen. |
| action | `share-app` optional, if specified, shares the app when tapped |

> Please specify one of `action`, `deepLink` or `externalLink`

Example: 
```json
{
  "component": "Card",
  "title": "foo",
  "body": "bar",
  "backgroundColor": "#FF0000",
  "icon": "http://foo/image.png",
  "externalLink": "http://govt.nz",
  "deepLink": "nzcovidtracer://SomeScreen"
}
```
#### Panels

| key | value |
| --- | ----- |
| component | `Panel` |
| title | title of the card |
| body | body of the card |
| backgroundColor | optional, background color of the color, defaults to `#FFFFFF` |
| buttons | optional, primary and secondary button, empty or empty array to hide buttons |
| buttons.text | button text |
| buttons.externalLink | optional, if specified, open the link on a browser when tapped |
| buttons.deepLink | optional, if specified, navigate the deep link when tapped |
| buttons.accessibilityHint | optional, if specified, override the default accessibility hint |

> Please specify either `deepLink` or `externalLink`

Example: 
```json
{
  "component": "Panel",
  "title": "foo",
  "body": "bar",
  "backgroundColor": "#FF0000",
  "buttons": [{
    "text": "primary",
    "deepLink": "nzcovidtracer://SomeScreen"
  }, {
    "text": "secondary",
    "externalLink": "http://govt.nz",
    "accessibilityHint": "Custom hint"
  }]
}
```

#### Info blocks

| key | value |
| --- | ----- |
| component | `InfoBlock` |
| icon | optional, icon of the card |
| backgroundColor | optional, background of the card, defaults to `#FFF1D0` |
| title | required, title of the card |
| body | required, body of the card |

Example:
```json
{
  "component": "InfoBlock",
  "icon": "http://foo/image.png",
  "backgroundColor": "#FF0000",
  "title": "foo",
  "body": "bar"
}
```

#### Sections

Section group cards and panels together:

| key | value |
| --- | ----- |
| title | optional, section title |
| data | an array of `Card` or `Panel` components |

There might be multiple sections in a scroll view.  

Example (2 sections):
```json
[{
  "data": [{
    "component": "Panel",
    "title": "foo",
    "body": "bar",
    "buttons": [{
      "text": "primary",
      "deepLink": "nzcovidtracer://SomeScreen"
    }]
  }, {
    "component": "Card",
    "title": "foo",
    "body": "bar"
  }]
},
{
  "title": "Section 2",
  "data": [{
    "component": "Panel",
    "title": "foo",
    "body": "bar"
  }]
}]
```


#### Deep links

For security and maintainability reasons, only a specified set of deeplinks will be supported

| link | behaviour |
| --- | ----- |
| nzcovidtracer://dashboard/today | Navigate to `dashboard` on the `today tab` |
| nzcovidtracer://dashboard/resources | Navigate to `dashboard` on the `resources tab` |
| nzcovidtracer://nhi | Navigate to `privacy` -> `add nhi`, if user has no NHI stored. Otherwise navigate to `edit nhi` |
| nzcovidtracer://diary | Navigate to `diary` |
| nzcovidtracer://manualEntry | Navigate to `manual entry` |

> Please note that these links are only supported from server driven components for now