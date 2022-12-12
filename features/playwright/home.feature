@foo
Feature: Home page

  @debug
  Scenario: Land on playwright website
    When I am on the playwright website
    Then the text "Playwright" is visible
