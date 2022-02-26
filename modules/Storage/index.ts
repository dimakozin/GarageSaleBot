
const categories = [
    {
        id: 0,
        name: 'Сумки'
    },
    {
        id: 1,
        name: 'Платья'
    },
    {
        id: 2,
        name: 'Рубашки'
    },
    {
        id: 3,
        name: 'Аксессуары'
    }

] 

const products = [
    {
        id: 0,
        name: 'Сумка 1',
        price: '100 ₽',
        categoryId: 0
    },
    {
        id: 1,
        name: 'Сумка 2',
        price: '200 ₽',
        categoryId: 0
    },
    {
        id: 2,
        name: 'Сумка 3',
        price: '300 ₽',
        categoryId: 0
    },
    {
        id: 3,
        name: 'Сумка 4',
        price: '400 ₽',
        categoryId: 0
    },
    {
        id: 4,
        name: 'Сумка 5',
        price: '500 ₽',
        categoryId: 0
    }
]

export default {
    getCategories: () => {
        return categories
    }
}
