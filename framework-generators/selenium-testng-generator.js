const fs = require("fs");
const path = require("path");

function generateSeleniumTestNGFramework(projectName = "selenium-testng-framework") {
    const basePath = path.join(process.cwd(), projectName);

    // Create directory structure
    const directories = [
        `${basePath}/src/test/java/tests`,
        `${basePath}/src/test/java/pages`,
        `${basePath}/src/test/java/base`,
        `${basePath}/src/test/java/utils`,
        `${basePath}/testdata`,
        `${basePath}/config`
    ];

    directories.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });

    // Generate pom.xml
    const pomXml = `<project>
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.qa.framework</groupId>
    <artifactId>${projectName}</artifactId>
    <version>1.0-SNAPSHOT</version>
    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>11</maven.compiler.source>
        <maven.compiler.target>11</maven.compiler.target>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.seleniumhq.selenium</groupId>
            <artifactId>selenium-java</artifactId>
            <version>4.18.1</version>
        </dependency>
        <dependency>
            <groupId>org.testng</groupId>
            <artifactId>testng</artifactId>
            <version>7.9.0</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.apache.poi</groupId>
            <artifactId>poi-ooxml</artifactId>
            <version>5.2.3</version>
        </dependency>
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>2.15.2</version>
        </dependency>
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-lang3</artifactId>
            <version>3.14.0</version>
        </dependency>
        <dependency>
            <groupId>com.aventstack</groupId>
            <artifactId>extentreports</artifactId>
            <version>5.0.9</version>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.1.2</version>
                <configuration>
                    <suiteXmlFiles>
                        <suiteXmlFile>testng.xml</suiteXmlFile>
                    </suiteXmlFiles>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
                <configuration>
                    <source>11</source>
                    <target>11</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`;

    fs.writeFileSync(`${basePath}/pom.xml`, pomXml);

    // Generate BaseTest.java
    const baseTest = `package base;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.edge.EdgeDriver;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Parameters;

import utils.DriverManager;

public class BaseTest {

    protected WebDriver driver;

    @BeforeMethod
    @Parameters({"browser"})
    public void setup(String browser) {
        driver = DriverManager.getDriver(browser);
    }

    @AfterMethod
    public void teardown() {
        if (driver != null) {
            driver.quit();
        }
    }
}`;

    fs.writeFileSync(`${basePath}/src/test/java/base/BaseTest.java`, baseTest);

    // Generate DriverManager.java
    const driverManager = `package utils;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;

public class DriverManager {

    public static WebDriver getDriver(String browser) {
        switch (browser.toLowerCase()) {
            case "chrome":
            case "ch":
                ChromeOptions chromeOptions = new ChromeOptions();
                chromeOptions.addArguments("--start-maximized");
                // Uncomment for headless: chromeOptions.addArguments("--headless=new");
                return new ChromeDriver(chromeOptions);
                
            case "firefox":
            case "ff":
                FirefoxOptions firefoxOptions = new FirefoxOptions();
                firefoxOptions.addArguments("--start-maximized");
                // Uncomment for headless: firefoxOptions.addArguments("--headless");
                return new FirefoxDriver(firefoxOptions);
                
            case "edge":
            case "ed":
                EdgeOptions edgeOptions = new EdgeOptions();
                edgeOptions.addArguments("--start-maximized");
                // Uncomment for headless: edgeOptions.addArguments("--headless=new");
                return new EdgeDriver(edgeOptions);
                
            default:
                // Default to Chrome
                ChromeOptions defaultOptions = new ChromeOptions();
                defaultOptions.addArguments("--start-maximized");
                return new ChromeDriver(defaultOptions);
        }
    }
}`;

    fs.writeFileSync(`${basePath}/src/test/java/utils/DriverManager.java`, driverManager);

    // Generate Sample Page Object
    const loginPage = `package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class LoginPage {

    private WebDriver driver;
    private WebDriverWait wait;

    // Locators
    private By usernameField = By.id("username");
    private By passwordField = By.id("password");
    private By loginButton = By.id("login");
    private By errorMessage = By.className("error-message");

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public void enterUsername(String username) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(usernameField))
            .sendKeys(username);
    }

    public void enterPassword(String password) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(passwordField))
            .sendKeys(password);
    }

    public void clickLogin() {
        wait.until(ExpectedConditions.elementToBeClickable(loginButton)).click();
    }

    public boolean isErrorMessageDisplayed() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(errorMessage))
                    .isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public void login(String username, String password) {
        enterUsername(username);
        enterPassword(password);
        clickLogin();
    }

    public String getPageTitle() {
        return driver.getTitle();
    }

    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }
}`;

    fs.writeFileSync(`${basePath}/src/test/java/pages/LoginPage.java`, loginPage);

    // Generate Sample Test
    const loginTest = `package tests;

import base.BaseTest;
import org.testng.Assert;
import org.testng.annotations.Test;
import pages.LoginPage;

public class LoginTest extends BaseTest {

    @Test
    public void testValidLogin() {
        LoginPage loginPage = new LoginPage(driver);
        
        // Navigate to login page
        driver.get("https://example.com/login");
        
        // Perform login
        loginPage.login("validuser", "validpass");
        
        // Verify successful login (example assertion)
        Assert.assertTrue(loginPage.getPageTitle().contains("Dashboard"),
                "Login failed - Dashboard page not displayed");
    }

    @Test
    public void testInvalidLogin() {
        LoginPage loginPage = new LoginPage(driver);
        
        // Navigate to login page
        driver.get("https://example.com/login");
        
        // Perform login with invalid credentials
        loginPage.login("invaliduser", "wrongpass");
        
        // Verify error message is displayed
        Assert.assertTrue(loginPage.isErrorMessageDisplayed(),
                "Error message should be displayed for invalid credentials");
    }
}`;

    fs.writeFileSync(`${basePath}/src/test/java/tests/LoginTest.java`, loginTest);

    // Generate testng.xml
    const testngXml = `<!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd" >
<suite name="Login Test Suite" parallel="methods" thread-count="2">
    <test name="Login Tests">
        <classes>
            <class name="tests.LoginTest"/>
        </classes>
    </test>
</suite>`;

    fs.writeFileSync(`${basePath}/testng.xml`, testngXml);

    // Generate sample test data (JSON)
    const testData = `{
  "validCredentials": {
    "username": "validuser",
    "password": "validpass"
  },
  "invalidCredentials": {
    "username": "invaliduser",
    "password": "wrongpass"
  },
  "lockedAccount": {
    "username": "lockeduser",
    "password": "lockedpass"
  }
}`;

    fs.writeFileSync(`${basePath}/testdata/loginData.json`, testData);

    // Generate config.properties
    const configProps = `# Environment Configuration
environment=test
base.url=https://example.com
browser=chrome
timeout=30
screenshot.on.failure=true
`;

    fs.writeFileSync(`${basePath}/config/config.properties`, configProps);

    // Generate README.md
    const readme = `# ${projectName}

This is a Selenium TestNG automation framework generated by the QA Automation Generator.

## Project Structure
\`\`\`
${projectName}
├── src
│   └── test
│       └── java
│           ├── base
│           │   └── BaseTest.java
│           ├── pages
│           │   └── LoginPage.java
│           ├── tests
│           │   └── LoginTest.java
│           └── utils
│               └── DriverManager.java
├── testdata
│   └── loginData.json
├── config
│   └── config.properties
├── testng.xml
└── pom.xml
\`\`\`

## Prerequisites
- Java JDK 11 or higher
- Maven 3.6+
- Chrome/Firefox/Edge browser (for test execution)

## Setup
1. Clone the repository
2. Update config.properties with your environment settings
3. Update testdata/loginData.json with your test credentials
4. Update the LoginTest.java with your actual test scenarios

## Running Tests
To run tests locally:
\`\`\`
mvn test
\`\`\`

To run tests with specific browser:
\`\`\`
mvn test -Dbrowser=chrome
\`\`\`

To run tests in headless mode (modify DriverManager.java):
\`\`\`
mvn test
\`\`\`

## Reports
TestNG generates default reports in:
- target/surefire-reports/

For enhanced reporting, ExtentReports is integrated (customize as needed).
`;

    fs.writeFileSync(`${basePath}/README.md`, readme);

    console.log(`Selenium TestNG framework generated successfully at: ${basePath}`);
    return basePath;
}

module.exports = { generateSeleniumTestNGFramework };