package com.example.AllEat.service;

import lombok.RequiredArgsConstructor;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.interactions.Actions;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantsCrawlingService {

    public void startCrawling() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        WebDriver driver = new ChromeDriver(options);
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(30));
        Actions actions = new Actions(driver);

        try {
            driver.get("https://map.kakao.com/");
            WebElement searchBox = wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("input#search\\.keyword\\.query")));
            searchBox.sendKeys("대전 유성구 봉명동 음식점");
            searchBox.sendKeys(Keys.ENTER);
            System.out.println("검색어 입력 완료");

            wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("li.PlaceItem.clickArea")));
            System.out.println("첫 번째 음식점 리스트 로드 완료");

            // 첫 화면의 음식점 리스트 크롤링
            crawlCurrentCafeList(driver, wait, actions);

            // 장소 더보기 버튼이 있을 때까지 클릭하여 리스트 크롤링
            if (clickShowMoreButton(driver, wait, actions)) {
                crawlCurrentCafeList(driver, wait, actions);

                // 장소 더보기를 누른 후 페이징은 2가 가리키고 있으므로 3부터 크롤링 시작
                handlePagination(driver, wait, actions, 3);
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            driver.quit();
        }
    }

    private void crawlCurrentCafeList(WebDriver driver, WebDriverWait wait, Actions actions) {
        List<WebElement> cafeLinks = driver.findElements(By.cssSelector("ul#info\\.search\\.place\\.list > li.PlaceItem.clickArea"));

        for (WebElement cafeLink : cafeLinks) {
            try {
                String cafeName = cafeLink.findElement(By.cssSelector("div.head_item.clickArea > strong.tit_name")).getText();
                cafeName = cafeName.replaceAll("^[A-Z]\\s+", "");
                System.out.println("전처리된 음식점 이름: " + cafeName);

                ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", cafeLink);
                actions.moveToElement(cafeLink).perform();

                WebElement detailLink = cafeLink.findElement(By.cssSelector("a.moreview"));
                ((JavascriptExecutor) driver).executeScript("arguments[0].click();", detailLink);
                System.out.println("상세보기 클릭 완료");

                String originalWindow = driver.getWindowHandle();
                wait.until(ExpectedConditions.numberOfWindowsToBe(2));
                for (String windowHandle : driver.getWindowHandles()) {
                    if (!windowHandle.equals(originalWindow)) {
                        driver.switchTo().window(windowHandle);
                        break;
                    }
                }

                List<String> menuList = getMenuDetails(driver, wait);
                saveCafeAndMenuData(cafeName, menuList);

                driver.close();
                driver.switchTo().window(originalWindow);
                System.out.println("원래 창으로 전환 완료");

            } catch (Exception e) {
                System.out.println("음식점 정보 수집 중 오류 발생: " + e.getMessage());
                driver.switchTo().window(driver.getWindowHandles().toArray()[0].toString());
            }
        }
    }

    private boolean clickShowMoreButton(WebDriver driver, WebDriverWait wait, Actions actions) {
        try {
            WebElement moreButton = driver.findElement(By.cssSelector("a#info\\.search\\.place\\.more"));
            if (moreButton != null && moreButton.isDisplayed()) {
                ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", moreButton);
                actions.moveToElement(moreButton).perform();
                ((JavascriptExecutor) driver).executeScript("arguments[0].click();", moreButton);
                System.out.println("장소 더보기 클릭 완료");
                Thread.sleep(2000);
                return true;
            }
        } catch (Exception e) {
            System.out.println("더 이상 장소 더보기가 없습니다.");
        }
        return false;
    }

    private List<String> getMenuDetails(WebDriver driver, WebDriverWait wait) {
        List<String> menuList = new ArrayList<>();
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("ul.list_menu")));
            List<WebElement> menuItems = driver.findElements(By.cssSelector("ul.list_menu > li"));
            for (WebElement menu : menuItems) {
                String menuName = menu.findElement(By.cssSelector("span.loss_word")).getText();
                String menuPrice = menu.findElement(By.cssSelector("em.price_menu")).getText();
                menuList.add(menuName + ": " + menuPrice);
            }
        } catch (Exception e) {
            menuList.add("메뉴 정보 없음");
        }
        return menuList;
    }

    private void handlePagination(WebDriver driver, WebDriverWait wait, Actions actions, int startPage) {
        while (true) {
            try {
                List<WebElement> pageNumbers = driver.findElements(By.cssSelector("a[id^='info.search.page.no']"));
                boolean nextPageClicked = false;

                for (WebElement pageNumber : pageNumbers) {
                    String pageText = pageNumber.getText();
                    int currentPage = Integer.parseInt(pageText);

                    if (currentPage >= startPage && pageNumber.isDisplayed()) {
                        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", pageNumber);
                        System.out.println("페이지 " + pageText + "로 이동");
                        Thread.sleep(2000);

                        crawlCurrentCafeList(driver, wait, actions);

                        while (clickShowMoreButton(driver, wait, actions)) {
                            crawlCurrentCafeList(driver, wait, actions);
                        }

                        if (currentPage == 34) {
                            System.out.println("페이지 34 크롤링 완료. 프로그램 종료.");
                            return;
                        }

                        if (currentPage % 5 == 0) {
                            WebElement nextPageButton = driver.findElement(By.cssSelector("button#info\\.search\\.page\\.next"));
                            if (nextPageButton != null && nextPageButton.isDisplayed()) {
                                ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", nextPageButton);
                                actions.moveToElement(nextPageButton).perform();
                                ((JavascriptExecutor) driver).executeScript("arguments[0].click();", nextPageButton);
                                System.out.println("다음 페이지 그룹으로 이동");
                                Thread.sleep(2000);

                                startPage = currentPage + 1;
                                nextPageClicked = true;
                            }
                            break;
                        }
                    }
                }

                if (!nextPageClicked) {
                    break;
                }
            } catch (Exception e) {
                e.printStackTrace();
                break;
            }
        }
    }

    private void saveCafeAndMenuData(String cafeName, List<String> menuList) {
        File csvFile = new File("crawledData.csv");
        boolean isNewFile = !csvFile.exists();

        try (FileWriter fileWriter = new FileWriter(csvFile, true);
             PrintWriter writer = new PrintWriter(fileWriter)) {

            // 새 파일일 경우 헤더 추가
            if (isNewFile) {
                writer.println("음식점 이름,메뉴 이름,메뉴 가격,에너지,탄수화물,단백질,지방");
            }

            for (String menu : menuList) {
                String[] menuParts = menu.split(": ");
                if (menuParts.length == 2) {
                    String menuPriceStr = menuParts[1].replaceAll("[^\\d]", "");
                    int menuPrice = menuPriceStr.isEmpty() ? 0 : Integer.parseInt(menuPriceStr);

                    // CSV 파일에 빈 영양 성분 항목 추가
                    writer.printf("%s,%s,%d, , , , \n", cafeName, menuParts[0], menuPrice);
                }
            }
            System.out.printf("음식점 '%s' 정보와 메뉴를 CSV에 저장 완료\n", cafeName);

        } catch (IOException e) {
            System.out.println("CSV 파일 저장 중 오류 발생: " + e.getMessage());
        }
    }
}
