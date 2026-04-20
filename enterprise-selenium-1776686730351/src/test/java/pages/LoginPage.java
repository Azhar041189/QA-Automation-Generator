package pages;

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
}