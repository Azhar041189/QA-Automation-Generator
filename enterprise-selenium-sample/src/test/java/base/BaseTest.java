package base;

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
}