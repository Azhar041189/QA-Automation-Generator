function generateApiTest(endpoint) {

    return `
const request = require("supertest")

describe("API Test",()=>{

it("should return 200", async ()=>{

const res = await request("${endpoint}")

expect(res.status).toBe(200)

})

})
`
}

module.exports = { generateApiTest }