//script to handle exporting and importing
const got = require('got')
const dotenv = require('dotenv').config();
const puppeteer = require("puppeteer")
const rl = require('readline-sync')


(async function() {
    try {


    } catch (err) {
        console.error(err)
    }

    inquirer
        .prompt([{
                type: "input",
                name: "domain",
                message: "What is the domain? "
            },
            {
                type: "list",
                name: "filePath",
                message: "Please select your csv",
                choices: filteredList
            },
            {
                type: "input",
                name: "canvasUser",
                message: "Enter your Instructure username"
            },
            {
                type: "password",
                name: "canvasPass",
                message: "Enter your Instructure password (This is never saved)",
                mask: "•"

            }
        ])
        .then(async answers => {
            (async function main() {
                try {
                    let current = moment().format('MMDDYY-HHmm')
                    let filename = csvOutput + "-" + current
                    fs.appendFile(filename + ".csv", 'url\n', e => console.error(e))
                    const browser = await puppeteer.launch({
                        headless: false,
                        defaultViewport: null,
                        devtools: false
                    })
                    const page = await browser.newPage();
                    await page.goto("https://instructure.okta.com/")
                        //login flow

                    await page.type('input[name=username]', answers.canvasUser, { delay: 100 })
                    await page.type('input[name=password]', answers.canvasPass, { delay: 100 })
                    await page.waitForTimeout(2000)
                    await page.click("#okta-signin-submit")

                    await page.waitForTimeout(2000)
                    authCode = rl.question("Please enter your authenticator code: ")
                    await page.type('input[name=answer]', authCode, { delay: 100 })
                        //put in logic so if the user put their password in wrong it'll ask for it again
                    await page.click('input[value=Verify]')
                    await page.waitForTimeout(2000)
                    await page.goto(`https://siteadmin.instructure.com/accounts/self`)
                    await page.waitForTimeout(2000)
                    await page.goto(`https://${answers.domain}.instructure.com/accounts/self`)


                    for (p in pageArray) {}

                    //The key to this script is getting an JSON web token from one of the network calls when you load into the New Quiz LTI
                    //They expire after an hour and I don't know how to refresh them yet.

                    api_key = process.env.API_KEY

                    //Once you have acquired the JWT from the New Quizzes API, make a call to the API. In this instance, we're querying
                    //the question banks endpoint because we're pulling from question banks, but realistically we could change the
                    //direction we're pulling data from depending on our needs

                    let base_url = `https://${answers.domain}.quiz-api-iad-prod.instructure.com/api/quizzes/${quiz_id}/quiz_entries`

                    headers = {
                            headers: {
                                "Authorization": api_key,
                                "Accept": "*/*",
                                "Cookie": "_ga=GA1.2.826490160.1610663736; canvas_sa_delegated=1"
                            }
                        }
                        //With this base URL we're going to want to query every single page of banks that the Canvas User has access to. 
                        //We can do this using the pagination.all method that the NPM package Got uses. It'll automatically query each 
                        //page until it hits the last one, simplifying how much code we'll need to write for this script to work.

                    let test = await got.get(base_url, headers)
                    test = JSON.parse(test.body)

                    console.dir(test, { depth: null })



                } catch (e) {
                    console.error(e)
                }
            })()
        })

})()