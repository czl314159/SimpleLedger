import { Category } from "@/types";

export const defaultCategories: Category[] = [
  { id: "expense:food", name: "餐饮", type: "expense", color: "#FF7043" },
  { id: "expense:transport", name: "交通", type: "expense", color: "#29B6F6" },
  { id: "expense:housing", name: "住房", type: "expense", color: "#8D6E63" },
  { id: "expense:shopping", name: "购物", type: "expense", color: "#AB47BC" },
  { id: "expense:entertainment", name: "娱乐", type: "expense", color: "#FFCA28" },
  { id: "expense:medical", name: "医疗", type: "expense", color: "#66BB6A" },
  { id: "expense:education", name: "教育", type: "expense", color: "#5C6BC0" },
  { id: "expense:others", name: "其他支出", type: "expense", color: "#78909C" },
  { id: "income:salary", name: "工资", type: "income", color: "#26A69A" },
  { id: "income:bonus", name: "奖金", type: "income", color: "#FFB300" },
  { id: "income:investment", name: "理财", type: "income", color: "#7E57C2" },
  { id: "income:others", name: "其他收入", type: "income", color: "#42A5F5" }
];

export const expenseCategories = defaultCategories.filter((item) => item.type === "expense");
export const incomeCategories = defaultCategories.filter((item) => item.type === "income");
