import { fireEvent, screen } from "@testing-library/react";

// prettier-ignore
class Sidebar {
  querySidebarRow = (id: string) =>
    screen.queryByTestId(`sidebar-row-${id}`);

  querySidebarArrow= (id: string) =>
    screen.queryByTestId(`row-arrow-${id}`);

  clickAddFolder= () =>
    fireEvent.click(screen.getByTestId("folder-add"));

  clickRemoveFolder= (folderId: string) =>
    fireEvent.click(screen.getByTestId(`folder-remove-${folderId}`));

  clickRenameFolder= (folderId: string) =>
    fireEvent.click(screen.getByTestId(`folder-rename-${folderId}`));

  clickRowArrow= (folderId: string) =>
    fireEvent.click(screen.getByTestId(`row-arrow-${folderId}`));

  enterTextIntoFolderInputField= (folderId: string, nextText: string) =>
    fireEvent.change(screen.getByTestId(`folder-input-${folderId}`), { target: { value: nextText } });

  loseFocusOnInput= (folderId: string) =>
    fireEvent.blur(screen.getByTestId(`folder-input-${folderId}`));

  getFolderTitle= (folderId: string) =>
    screen.queryByTestId(`folder-title-${folderId}`)?.innerHTML;

  focusOnItem = (folderId: string) => {
    const elem = this.querySidebarRow(folderId);
    if (!elem)
      throw new Error("Test error: Can't find folder with id: " + folderId);
    else fireEvent.click(elem);
  };
}

export default new Sidebar();
