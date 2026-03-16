package utils;

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
}