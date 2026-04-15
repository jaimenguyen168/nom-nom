import { nomnomDb } from "@/db";
import { categories } from "@/db/schemas/categories";

const categoriesData = [
  {
    key: "breakfast",
    name: "Breakfast",
    imageUrl:
      "https://potatorolls.com/wp-content/uploads/Lumberjack-Breakfast2.jpg",
  },
  {
    key: "lunch",
    name: "Lunch",
    imageUrl:
      "https://images.immediate.co.uk/production/volatile/sites/30/2010/06/Easy-falafels-786beb5.jpg?quality=90&resize=708,643",
  },
  {
    key: "dinner",
    name: "Dinner",
    imageUrl:
      "https://images.immediate.co.uk/production/volatile/sites/2/2021/04/LAMBFINAL-cf7a4ad.jpg?quality=90&resize=708,643",
  },
  {
    key: "dessert",
    name: "Dessert",
    imageUrl:
      "https://www.tasteofhome.com/wp-content/uploads/2025/07/30-Summer-Desserts-That-Are-No-Bake-and-Oh-So-Easy_TOHcom23_27515_P2_MD_03_22_6b.jpg",
  },
  {
    key: "vegan",
    name: "Vegan",
    imageUrl:
      "https://www.piedmont.org/-/media/images/in-use/blogs/vegan-vs-plant-based.jpg?h=531&iar=0&w=913&hash=938565BD2BEBAF0763F31E006A9817C4",
  },
  {
    key: "quick",
    name: "Quick & Easy",
    imageUrl:
      "https://beautifuleatsandthings.com/wp-content/uploads/2021/08/Easy-Chicken-Quesadillas_Beautifuleatsandthings_01-918x1024.jpg",
  },
  {
    key: "healthy",
    name: "Healthy",
    imageUrl:
      "https://www.eatingwell.com/thmb/mHa-uNAyeZz5sbLzjPpFp09y6aI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/49699711-3ea0add70b814bf592d9b9e9f78e0d09.jpg",
  },
  {
    key: "salad",
    name: "Salad",
    imageUrl:
      "https://www.eatingwell.com/thmb/S2NGMEcgm11dtdBJ6Hwprwq-nVk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/eat-the-rainbow-chopped-salad-with-basil-mozzarella-beauty-185-278133-4000x2700-56879ac756cd46ea97944768847b7ea5.jpg",
  },
  {
    key: "soup",
    name: "Soup",
    imageUrl:
      "https://sugarspunrun.com/wp-content/uploads/2024/12/Vegetable-soup-recipe-2-of-2.jpg",
  },
  {
    key: "cake",
    name: "Cake",
    imageUrl:
      "https://cdn.jwplayer.com/v2/media/W4yH8741/thumbnails/8Mhboqg7.jpg?width=1280",
  },
  {
    key: "smoothies",
    name: "Smoothies",
    imageUrl:
      "https://www.beveragedaily.com/resizer/v2/QSRDJ7WC7RP6XAPDJSS4ZS5F2A.jpg?auth=db930caaa79100ecb2af1a5b95f3b92843cf33846a1df0f391c58a77f79d0b7f",
  },
  {
    key: "cocktail",
    name: "Cocktail",
    imageUrl:
      "https://www.halfbakedharvest.com/wp-content/uploads/2019/10/Smoky-Harvest-Apple-Cider-Margarita-1.jpg",
  },
];

async function seed() {
  await nomnomDb
    .insert(categories)
    .values(categoriesData)
    .onConflictDoNothing();
  console.log("Seeded categories");
  process.exit(0);
}

seed();
