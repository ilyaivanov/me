import { screen, fireEvent } from "@testing-library/react";

//TODO: my production code depends on @testing-library/react (impacts bundle size)
//make sure I would extract all test ids across the project
//into separate files without dependencies
export const ids = {
  searchInput: "search-input",
  searchButton: "search-button",
  toggleSidebarButton: "toggle-sidebar",
};

const header = {
  enterSearchTerm(term: string) {
    fireEvent.change(screen.getByTestId(ids.searchInput), {
      target: { value: term },
    });
  },

  clickSearch() {
    fireEvent.click(screen.getByTestId(ids.searchButton));
  },

  async waitForPageRender(){
    await screen.findByTestId("sidebar")
  }

};

export default header;
