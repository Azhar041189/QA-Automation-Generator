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
        `${basePath}/config`,
        `${basePath}/reports`
    ];

    directories.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });

    // Generate pom.xml
    const pomXml = `<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
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
        <!-- Selenium -->
        <dependency>
            <groupId>org.seleniumhq.selenium</groupId>
            <artifactId>selenium-java</artifactId>
            <version>4.18.1</version>
        </dependency>
        <!-- TestNG -->
        <dependency>
            <groupId>org.testng</groupId>
            <artifactId>testng</artifactId>
            <version>7.9.0</version>
            <scope>test</scope>
        </dependency>
        <!-- Apache POI for Excel -->
        <dependency>
            <groupId>org.apache.poi</groupId>
            <artifactId>poi-ooxml</artifactId>
            <version>5.2.3</version>
        </dependency>
        <!-- Extent Reports -->
        <dependency>
            <groupId>com.aventstack</groupId>
            <artifactId>extentreports</artifactId>
            <version>5.0.9</version>
        </dependency>
        <!-- Log4j -->
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-core</artifactId>
            <version>2.20.0</version>
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
        </plugins>
    </build>
</project>`;

    fs.writeFileSync(`${basePath}/pom.xml`, pomXml);

    // Generate BaseTest.java with ExtentReports integration
    const baseTest = `package base;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.Status;
import org.openqa.selenium.WebDriver;
import org.testng.ITestResult;
import org.testng.annotations.*;
import utils.DriverManager;
import utils.ExtentManager;

public class BaseTest {

    protected WebDriver driver;
    protected static ExtentReports extent;
    protected ExtentTest test;

    @BeforeSuite
    public void setupSuite() {
        extent = ExtentManager.getReport();
    }

    @BeforeMethod
    @Parameters({"browser", "headless"})
    public void setup(@Optional("chrome") String browser, @Optional("false") String headless) {
        test = extent.createTest(getClass().getSimpleName());
        driver = DriverManager.getDriver(browser, Boolean.parseBoolean(headless));
        test.log(Status.INFO, "Starting test on " + browser + (Boolean.parseBoolean(headless) ? " (Headless)" : ""));
    }

    @AfterMethod
    public void teardown(ITestResult result) {
        if (result.getStatus() == ITestResult.FAILURE) {
            test.log(Status.FAIL, "Test Failed: " + result.getThrowable());
        } else if (result.getStatus() == ITestResult.SKIP) {
            test.log(Status.SKIP, "Test Skipped: " + result.getThrowable());
        } else {
            test.log(Status.PASS, "Test Passed");
        }

        if (driver != null) {
            driver.quit();
        }
    }

    @AfterSuite
    public void tearDownSuite() {
        extent.flush();
    }
}`;

    fs.writeFileSync(`${basePath}/src/test/java/base/BaseTest.java`, baseTest);

    // Generate ExcelReader.java
    const excelReader = `package utils;

import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.FileInputStream;
import java.io.IOException;

public class ExcelReader {

    private static final String FILE_PATH = "testdata/loginData.xlsx";

    public static String getCellData(int row, int col) throws Exception {
        try (FileInputStream file = new FileInputStream(FILE_PATH);
             XSSFWorkbook workbook = new XSSFWorkbook(file)) {
            XSSFSheet sheet = workbook.getSheet("Sheet1");
            return sheet.getRow(row).getCell(col).getStringCellValue();
        } catch (IOException e) {
            throw new Exception("Could not read Excel file: " + e.getMessage());
        }
    }
}`;

    fs.writeFileSync(`${basePath}/src/test/java/utils/ExcelReader.java`, excelReader);

    // Generate ExtentManager.java
    const extentManager = `package utils;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;

public class ExtentManager {

    private static ExtentReports extent;

    public static ExtentReports getReport() {
        if (extent == null) {
            ExtentSparkReporter reporter = new ExtentSparkReporter("reports/report.html");
            reporter.config().setReportName("QA Automation Results");
            reporter.config().setDocumentTitle("Enterprise Test Report");
            
            extent = new ExtentReports();
            extent.attachReporter(reporter);
            extent.setSystemInfo("Tester", "QA Engineer");
            extent.setSystemInfo("Environment", "QA");
        }
        return extent;
    }
}`;

    fs.writeFileSync(`${basePath}/src/test/java/utils/ExtentManager.java`, extentManager);

    // Generate DriverManager.java with Headless support
    const driverManager = `package utils;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;

public class DriverManager {

    public static WebDriver getDriver(String browser, boolean headless) {
        switch (browser.toLowerCase()) {
            case "chrome":
                ChromeOptions chromeOptions = new ChromeOptions();
                if (headless) {
                    chromeOptions.addArguments("--headless=new");
                    chromeOptions.addArguments("--window-size=1920,1080");
                }
                chromeOptions.addArguments("--start-maximized");
                return new ChromeDriver(chromeOptions);
                
            case "firefox":
                FirefoxOptions firefoxOptions = new FirefoxOptions();
                if (headless) {
                    firefoxOptions.addArguments("--headless");
                }
                return new FirefoxDriver(firefoxOptions);
                
            case "edge":
                EdgeOptions edgeOptions = new EdgeOptions();
                if (headless) {
                    edgeOptions.addArguments("--headless=new");
                }
                return new EdgeDriver(edgeOptions);
                
            default:
                return new ChromeDriver();
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

    // Generate LoginTest.java showing Data-Driven usage
    const loginTest = `package tests;

import base.BaseTest;
import org.testng.annotations.Test;
import pages.LoginPage;
import utils.ExcelReader;

public class LoginTest extends BaseTest {

    @Test
    public void testLoginWithExcelData() throws Exception {
        LoginPage loginPage = new LoginPage(driver);
        
        // Reading data from Excel
        String username = ExcelReader.getCellData(1, 0); // Row 1, Col 0
        String password = ExcelReader.getCellData(1, 1); // Row 1, Col 1
        
        test.info("Attempting login with user: " + username);
        
        driver.get("https://example.com/login");
        loginPage.login(username, password);
        
        test.pass("Login sequence completed for " + username);
    }
}`;

    fs.writeFileSync(`${basePath}/src/test/java/tests/LoginTest.java`, loginTest);

    // Generate testng.xml with parameters
    const testngXml = `<!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd" >
<suite name="Enterprise Suite" parallel="tests" thread-count="2">
    <parameter name="browser" value="chrome"/>
    <parameter name="headless" value="false"/>
    <test name="Login Tests">
        <classes>
            <class name="tests.LoginTest"/>
        </classes>
    </test>
</suite>`;

    fs.writeFileSync(`${basePath}/testng.xml`, testngXml);

    // Generate sample test data (JSON) - REMOVED as per instruction, replaced by Excel
    // fs.writeFileSync(`${basePath}/testdata/loginData.json`, testData);

    // Generate config.properties - REMOVED as per instruction, parameters in testng.xml
    // fs.writeFileSync(`${basePath}/config/config.properties`, configProps);

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
│               ├── DriverManager.java
│               ├── ExcelReader.java
│               └── ExtentManager.java
├── testdata
│   └── loginData.xlsx (Example Excel file for data-driven tests)
├── config
│   └── (empty or custom config files)
├── reports
│   └── report.html (ExtentReports output)
├── testng.xml
└── pom.xml
\`\`\`

## Prerequisites
- Java JDK 11 or higher
- Maven 3.6+
- Chrome/Firefox/Edge browser (for test execution)

## Setup
1. Clone the repository.
2. Place your Excel test data file (e.g., \`loginData.xlsx\`) in the \`testdata\` folder.
   - Ensure the Excel file has a sheet named "Sheet1" and data structured as expected by \`ExcelReader.java\`.
3. Update the \`LoginTest.java\` with your actual test scenarios and Excel data access.
4. Modify \`testng.xml\` parameters for browser and headless mode as needed.

## Running Tests
To run tests locally using Maven:
\`\`\`
mvn clean test
\`\`\`

To run tests with specific browser and headless mode via Maven command line:
\`\`\`
mvn clean test -Dbrowser=firefox -Dheadless=true
\`\`\`
(Note: Parameters in \`testng.xml\` will be overridden by command line parameters if provided.)

## Reports
ExtentReports are generated in:
- \`reports/report.html\`

TestNG also generates default reports in:
- \`target/surefire-reports/\`
`;

    fs.writeFileSync(`${basePath}/README.md`, readme);

    console.log(`Enterprise Selenium framework generated at: ${basePath}`);
    return basePath;
}

module.exports = { generateSeleniumTestNGFramework };