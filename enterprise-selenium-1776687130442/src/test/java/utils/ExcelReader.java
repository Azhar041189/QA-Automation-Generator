package utils;

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
}