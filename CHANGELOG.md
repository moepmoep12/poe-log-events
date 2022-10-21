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
