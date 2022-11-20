# [4.0.0](https://github.com/moepmoep12/poe-log-events/compare/v3.2.0...v4.0.0) (2022-11-20)


### Code Refactoring

* currencies ([9c9f8cd](https://github.com/moepmoep12/poe-log-events/commit/9c9f8cdc12607d0d6604f980e8eea9b53c4fb173))


### BREAKING CHANGES

* Currencies have been reworked to better emphasize that these refer to the PoE Trade API.
- The enum `CurrencyGroup` has been renamed to `TradeCurrencyGroup`
- The type `CurrencyId` has been renamed to `TradeCurrencyId`
- The interface `CurrencyItem` has been removed. It is replaced by the interfaces `TradeCurrencyItem`, `LocalizedTradeCurrencyItem`,
 and `TradeBulkCurrencyItem` which is used by events
- The method `getCurrencyItemByName` has been renamed to `getTradeCurrencyItemByName`
- The method `getCurrencyItemById` has been renamed to `getTradeCurrencyItemByTradeId`
- The exports inside TradeCurrencyIds.ts are exported together as TradeCurrencyIds.
Thus the enums are now longer listed when importing the library with import {} from 'poe-log-events'
- The tests have been adjusted accordingly
- The script updateCurrencies.ts has been reworked to use ts-morph
- The Currency.json has been updated. GGG fixed bugs with localization
- Added & improved JSDOCs

# [3.2.0](https://github.com/moepmoep12/poe-log-events/compare/v3.1.2...v3.2.0) (2022-10-22)


### Features

* Add getCurrencyItemById ([07e7773](https://github.com/moepmoep12/poe-log-events/commit/07e77738e64014a4acd92673ae6820e91f218166))

## [3.1.2](https://github.com/moepmoep12/poe-log-events/compare/v3.1.1...v3.1.2) (2022-10-21)


### Bug Fixes

* Export world area ([03d7026](https://github.com/moepmoep12/poe-log-events/commit/03d7026b410e30718effc8741ace8ed848baacbe))

## [3.1.1](https://github.com/moepmoep12/poe-log-events/compare/v3.1.0...v3.1.1) (2022-10-21)


### Bug Fixes

* Add logLevel to test events ([be4b261](https://github.com/moepmoep12/poe-log-events/commit/be4b261adfd86a2044909f7c0ebd77e92bf7d9fb))

# [3.1.0](https://github.com/moepmoep12/poe-log-events/compare/v3.0.1...v3.1.0) (2022-10-21)


### Bug Fixes

* Remove console.log ([7a4d617](https://github.com/moepmoep12/poe-log-events/commit/7a4d6170376563ed6c26fba4815f323094a79e6b))


### Features

* Improve tail & matching ([67633e7](https://github.com/moepmoep12/poe-log-events/commit/67633e77ef136155e0df1c78402e620c5184eda4))

## [3.0.1](https://github.com/moepmoep12/poe-log-events/compare/v3.0.0...v3.0.1) (2022-10-21)


### Bug Fixes

* Add dependency tiny-typed-emitter ([148c60c](https://github.com/moepmoep12/poe-log-events/commit/148c60c9aac1efc41c1e33dc281854019ba84b14))

# [3.0.0](https://github.com/moepmoep12/poe-log-events/compare/v2.0.0...v3.0.0) (2022-10-21)


### Features

* Add world areas ([ffca607](https://github.com/moepmoep12/poe-log-events/commit/ffca607702b80d47f3add9a5401bc19622ad76d8))


### BREAKING CHANGES

* - Renamed 'areaChanged' event to 'areaEntered' to be in line with the event object & matcher
- Add event 'areaGenerated' & static world area resources
- Improved comments

# [2.0.0](https://github.com/moepmoep12/poe-log-events/compare/v1.0.0...v2.0.0) (2022-10-18)


### Features

* Add currency classes ([9234e71](https://github.com/moepmoep12/poe-log-events/commit/9234e71dd89f9e9f745ea8f59a8ecfbd6a4a24d9))


### BREAKING CHANGES

* The trade whisper events now provide a CurrencyItem object
instead of a string.
The enums for currencies are generated via the poe-api-ts library.

# 1.0.0 (2022-10-16)


### Bug Fixes

* codecov badge ([d1820ad](https://github.com/moepmoep12/poe-log-events/commit/d1820adfaf20592b10edf5ae179d31b585a98c1a))
