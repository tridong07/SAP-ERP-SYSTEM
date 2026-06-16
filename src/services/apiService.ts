import { ALL_DATA_SOURCES } from "../lib/data-sources";

export const getSourceOptions = async (sourceKey: string) => {
  // Gỉa lập độ trễ truy vấn DB
  return new Promise((resolve) => {
    setTimeout(() => {
      // Ở đây sau này sẽ là: return await axios.get(DATA_SOURCES[sourceKey].endpoint)
      const mockData = {
        EMPLOYEES: [{ value: "NV01", label: "Nguyễn Văn A" }, { value: "NV02", label: "Trần Thị B" }],
        PRODUCTS: [{ value: "SP01", label: "Laptop Dell" }, { value: "SP02", label: "Chuột" }]
      };
      resolve(mockData[sourceKey as keyof typeof mockData] || []);
    }, 300);
  });
};