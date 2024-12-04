import React, { useEffect, useState,useCallback } from "react";
import { getMenuItems, deleteMenuItem, MenuItem } from "../../services/Menu";
import Modal from "./Modal";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import { subscribeToAuthChanges } from "../../services/Auth";
import { Category, getCategories } from "../../services/Categories";
import { addMenuItem, updateMenuItem } from "../../services/Menu";
import { Badge } from "./ui/badge";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCategoryManagement } from '../../Hooks/useCategoryManagement';


const validationSchema = yup.object().shape({ 
  name: yup.string().required("Menu item name is required"),
  description: yup.string().required("Description is required"),
  images: yup
  .mixed()
  .test('fileSize', 'File size is too large', (value) => {
    if (!value || !Array.isArray(value)) return true;
    return Array.from(value).every((file) => file.size <= 5000000); // 5MB limit
  })
  .test('fileType', 'Unsupported file format', (value) => {
    if (!value || !Array.isArray(value)) return true;
    return Array.from(value).every((file) =>
      ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
    );
  }),
  price: yup
    .number()
    .typeError('Price must be a number')
    .moreThan(99, 'Price must be more than 100')
    .required('Price is required'),
  categoryId: yup.string().required('Category is required'),
});

interface FormInputProps {
    label: string;
    name: string;
    control: any;
    errors: any;
    type?: string;
    component: React.ComponentType<any>;
    options: any;
    error: any;
}

const FormInput:React.FC<FormInputProps> = ({ control, name, label, component: Component, options, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => <Component {...field} options={options} />}
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

interface MenuItemFormProps {
  onSubmit: () => void;
  initialValues?: Partial<MenuItem>;
  isUpdate?: boolean;
}

const DisplayMenuItems: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { categories } = useCategoryManagement();
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<string | null>(null);
  const [role, setRole] = useState<'user' | 'admin' | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMenuItemsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const menuItemsList = await getMenuItems();

      const categorizedMenuItems = menuItemsList.map(item => ({
        ...item,
        categoryName: categories.find(cat => cat.id === item.categoryId)?.name || "Unknown Category"
      }));

      setMenuItems(categorizedMenuItems);
    } catch (error) {
      setError("Error fetching menu items");
    } finally {
      setLoading(false);
    }
  }, [categories]);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(setRole);
    fetchMenuItemsData();
    return () => unsubscribe();
  }, [fetchMenuItemsData]);

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const result = await deleteMenuItem(id);
      if (result.success) {
        setMenuItems(prevItems => prevItems.filter(item => item.id !== id));
      } else {
        setError("Error deleting menu item");
      }
    } catch (error) {
      setError("Error deleting menu item");
      console.error("Error deleting menu item: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = (id: string) => {
    setSelectedMenuItemId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMenuItemId(null);
  };

  useEffect(() => {
    fetchMenuItemsData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {role === 'user' && <div className="text-lg font-semibold mb-4">I'm simply a User</div>}
      {role === 'admin' && (
        <div>
          <Badge variant="outline" className="mb-4">Admin</Badge>
          <h2 className="text-2xl font-bold mb-4">Add Menu Item</h2>
          <MenuItemForm onSubmit={fetchMenuItemsData} />
          <div className="mt-8">
            <h1 className="text-3xl font-bold mb-6">Menu Items from Firebase</h1>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.length > 0 ? (
                  menuItems.map(item => (
                    <li key={item.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                      <div className="p-4">
                        <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                        {item?.mainImage && <img src={item?.mainImage} alt={item.name} className="w-full h-48 object-cover mb-4" />}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.images && item.images.map((image, index) => (
                            <img key={index} src={image} alt={`${item.name}-${index}`} className="w-24 h-24 object-cover rounded" />
                          ))}
                        </div>
                        <p className="text-gray-600 mb-2">{item.description}</p>
                        {item.price !== undefined ? (
                          <p className="text-lg font-semibold mb-2">Price:{item.price.toFixed(2)} Fcfa</p>
                        ) : (
                          <p className="text-lg font-semibold mb-2">Price: N/A</p>
                        )}
                        <p className="text-sm text-gray-500 mb-4">Category: {item.categoryName || "Unknown Category"}</p>
                        <div className="flex justify-between">
                          <button onClick={() => handleDelete(item.id || '')} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete</button>
                          <button onClick={() => handleUpdateClick(item.id || '')} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Update</button>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-600">No menu items available</li>
                )}
              </ul>

            )}
          </div>
          {selectedMenuItemId && (
            <UpdateMenuItemModal
              show={showModal}
              onClose={handleCloseModal}
              menuItemId={selectedMenuItemId}
              onUpdate={fetchMenuItemsData}
              menuItem={menuItems.find(item => item.id === selectedMenuItemId)!}
            />
          )}
        </div>
      )}
      {role === null && <div className="text-lg font-semibold">Not logged in</div>}
    </div>
  );
};


interface UpdateMenuItemModalProps {
  show: boolean;
  onClose: () => void;
  menuItemId: string;
  onUpdate: () => void;
}


interface UpdateMenuItemModalProps {
  show: boolean;
  onClose: () => void;
  menuItemId: string;
  onUpdate: () => void;
  menuItem: MenuItem;
}



const submitMenuItemForm = async (
  isUpdate: boolean,
  menuItemId: string | undefined,
  formData: FormValues,
  onSubmit: () => void,
  setError: (message: string | null) => void,
  setLoading: (loading: boolean) => void
) => {
  setLoading(true);
  setError(null);

  try {
    const menuItemData = {
      name: formData.name,
      images: Array.from(formData.images),
      description: formData.description,
      price: Number(formData.price) || 0,
      categoryId: formData.categoryId
    };
    // console.log("page MenuItems 1",menuItemData)

    if (isUpdate && menuItemId) {
      await updateMenuItem(menuItemId, menuItemData as Partial<MenuItem> & { images?: File[] | undefined; });
    } else {
      await addMenuItem(menuItemData);
    }
    onSubmit();
  } catch (error) {
    console.error(`Error ${isUpdate ? 'updating' : 'adding'} menu item: `, error);
    setError(`Failed to ${isUpdate ? 'update' : 'add'} menu item`);
  } finally {
    setLoading(false);
  }
};

const UpdateMenuItemModal: React.FC<UpdateMenuItemModalProps> = ({ show, onClose, menuItemId, onUpdate, menuItem }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const { control, handleSubmit, formState: { errors } } = useForm<any>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: menuItem.name,
      description: menuItem.description,
      price: Number(menuItem.price) || 0,
      categoryId: menuItem.categoryId,
    }
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (formData: FormValues) => {
  await submitMenuItemForm(true, menuItemId, formData, onUpdate, setError, setLoading);
};

  return (
    <Modal show={show} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">Update Menu Item</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          control={control}
          name="name"
          label="Menu Item Name"
          component={TextInput}
          error={errors.name?.message}
          options={''}
          errors={errors}
        />

        <FormInput
          control={control}
          name="images"
          label="Images"
          component={({ onChange }: { onChange: (files: FileList | null) => void }) => (
            <input
              type="file"
              onChange={(e) => onChange(e.target.files)}
              multiple
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          error={errors.images?.message}
          options={''}
          errors={errors}
        />

        <FormInput
          control={control}
          name="description"
          label="Description"
          component={TextInput}
          error={errors.description?.message}
          options={''}
          errors={errors}
        />

        <FormInput
          control={control}
          name="price"
          label="Price"
          component={TextInput}
          error={errors.price?.message}
          errors={errors}
          options={''}
        />

        <FormInput
          control={control}
          name="categoryId"
          label="Category"
          component={SelectInput}
          options={categories}
          error={errors.categoryId?.message}
          errors={errors}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Updating...' : 'Update Menu Item'}
        </button>
      </form>
    </Modal>
  );
};

interface FormValues {
  name: string;
  images: FileList;
  description: string;
  price: number;
  categoryId: string;
}


const MenuItemForm: React.FC<MenuItemFormProps> = ({ onSubmit, initialValues = {}, isUpdate = false }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<any>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: initialValues.name || '',
      description: initialValues.description || '',
      price: Number(initialValues.price) || 0,
      categoryId: initialValues.categoryId || '',
    }
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories: ', error);
        setError('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  const onSubmitForm = async (data: FormValues) => {
    await submitMenuItemForm(isUpdate, initialValues.id, data, onSubmit, setError, setLoading);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <FormInput
        control={control}
        name="name"
        label="Menu Item Name"
        component={TextInput}
        error={errors.name?.message}
        options={''}
        errors={errors}
      />

      <FormInput
        control={control}
        name="images"
        label="Images"
        component={({ onChange }: { onChange: (files: FileList | null) => void }) => (
          <input
            type="file"
            onChange={(e) => onChange(e.target.files)}
            multiple
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
        error={errors.images?.message}
        options={''}
        errors={errors}
      />

      <FormInput
        control={control}
        name="description"
        label="Description"
        component={TextInput}
        error={errors.description?.message}
        options={''}
        errors={errors}
      />

      <FormInput
        control={control}
        name="price"
        label="Price"
        component={TextInput}
        error={errors.price?.message}
        options={''}
        errors={errors}
      />

      <FormInput
        control={control}
        name="categoryId"
        label="Category"
        component={SelectInput}
        options={categories.map(category => ({ id: category.id, name: category.name, description: category.description }))}
        error={errors.categoryId?.message}
        errors={errors}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (isUpdate ? 'Updating...' : 'Adding...') : (isUpdate ? 'Update Menu Item' : 'Add Menu Item')}
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
};

export default DisplayMenuItems;