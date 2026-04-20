package utils;

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
}