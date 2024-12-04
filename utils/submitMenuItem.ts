// utils/submitMenuItem.ts
export const submitMenuItem = async (
    formData: FormValues, 
    isUpdate: boolean, 
    menuItemId: string | undefined, 
    onSubmit: () => void, 
    setError: (message: string | null) => void, 
    setLoading: (loading: boolean) => void
  ) => {
    setLoading(true);
    setError(null);
  
    try {
      const menuItemData = {
        name: formData.name,
        images: Array.from(formData.imageFiles),
        description: formData.description,
        price: parseFloat(formData.price),
        categoryId: formData.categoryId,
      };
  
      if (isUpdate && menuItemId) {
        await updateMenuItem(menuItemId, menuItemData);
      } else {
        await addMenuItem(menuItemData);
      }
      onSubmit();
    } catch (error) {
      setError(`Failed to ${isUpdate ? 'update' : 'add'} menu item`);
    } finally {
      setLoading(false);
    }
  };
  