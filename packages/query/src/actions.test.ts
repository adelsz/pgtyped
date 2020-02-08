import { generateHash} from "./actions";

test("test postgres md5 hash generation", () => {
  const salt = [0x81, 0xcc, 0x95, 0x8b]
  const result = generateHash("test", "example", Buffer.from(salt))
  expect(result).toEqual("md5b73f398d18e98f8e2d46a7f1c548dea3")
})
