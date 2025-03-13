import { fakerIT as faker } from "@faker-js/faker";
import { writeFileSync } from 'fs';

const OUTPUT_FILE = './products.json';

function getRandomProducts() {
  return {
    id: faker.database.mongodbObjectId(),
    name: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    netPrice: parseFloat(faker.commerce.price()),
    weight: faker.number.int({ min: 50, max: 2000 }),
    discount: faker.number.float({min: 0, max: 1, fractionDigits: 2}),
  };
}

function getDataSet(num: number) {
  const data: any = [];
  for (let i = 0; i < num; i++) {
    data.push(getRandomProducts());
  }
  return data;
}

function writeDataSet(data: any[]) {
  writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, '\t' ), { encoding: 'utf-8' });
}

const args = process.argv.slice(2);
const valueArg = args.find((arg) => arg.startsWith("value="));
const value = valueArg ? parseInt(valueArg.split("=")[1], 10) : 10;

const data = getDataSet(value);
writeDataSet(data);
console.log('done', value, 'products');