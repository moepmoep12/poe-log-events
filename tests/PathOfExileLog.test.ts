import { describe, it } from "mocha";
import { expect } from "chai";

import { PathOfExileLog } from "../src/PathOfExileLog";

describe(`PoELogEvents - PathOfExileLog`, function () {
  it(`invalid log file - should throw`, () => {
    const filePath = "abc";

    expect(() => {
      new PathOfExileLog({
        logFilePath: filePath,
      });
    }).to.throw(`The specified log file ${filePath} does not exist`);
  });
});
