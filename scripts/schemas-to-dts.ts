import { compile } from 'json-schema-to-typescript';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Generate TypeScript interfaces from JSON schemas.
 */
async function generate() {
  const orderSchema = require(path.join(__dirname, '../schemas/order.json'));
  const dts = await compile(orderSchema, 'WhatIsThis', {
    enableTrailingSemicolonForTypes: true,
    enableTrailingSemicolonForEnums: true,
    enableTrailingSemicolonForInterfaceProperties: true,
    enableTrailingSemicolonForInterfaces: false,
    indentWith: '  '
  });
  const outDir = path.join(__dirname, '../interfaces');
  try {
    fs.mkdirSync(outDir);
  } catch (err) {
    // if the dir already exists soldier on
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
  fs.writeFileSync(path.join(outDir, 'order.d.ts'), dts);
}

generate();
