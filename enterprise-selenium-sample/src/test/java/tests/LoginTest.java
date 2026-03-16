package tests;

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
}