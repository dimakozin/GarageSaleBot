import { type } from "os"

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
        categoryId: 0,
        file_id: 'AgACAgIAAxkBAAICPWIaOeQwoIbZXG-x1uiGvxDjs-SaAAIHuTEbpKzYSE4mXWDfN29dAQADAgADeAADIwQ'
    },
    {
        id: 1,
        name: 'Сумка 2',
        price: '200 ₽',
        categoryId: 0,
        file_id: 'AgACAgIAAxkBAAICP2IaOkTWntLWCgJYfiYQCu8KjvhzAAIIuTEbpKzYSLznPvyIW4RMAQADAgADeQADIwQ'
    },
    {
        id: 2,
        name: 'Сумка 3',
        price: '300 ₽',
        categoryId: 0,
        file_id: 'AgACAgIAAxkBAAICPWIaOeQwoIbZXG-x1uiGvxDjs-SaAAIHuTEbpKzYSE4mXWDfN29dAQADAgADeAADIwQ'
    },
    {
        id: 3,
        name: 'Сумка 4',
        price: '400 ₽',
        categoryId: 0,
        file_id: 'AgACAgIAAxkBAAICPWIaOeQwoIbZXG-x1uiGvxDjs-SaAAIHuTEbpKzYSE4mXWDfN29dAQADAgADeAADIwQ'
    },
    {
        id: 4,
        name: 'Сумка 5',
        price: '500 ₽',
        categoryId: 0,
        file_id: 'AgACAgIAAxkBAAICPWIaOeQwoIbZXG-x1uiGvxDjs-SaAAIHuTEbpKzYSE4mXWDfN29dAQADAgADeAADIwQ'
    }
]

interface userLikedProducts {
    username: string,
    likedProducts: Array<number>
}

const likedProducts = [] as Array<userLikedProducts>

export default {
    getCategories: () => {
        return categories ?? []
    },
    getProdFromCategory: (categoryId: number, seqNumber: number) => {
        const categoryProducts = products.filter(product => product.categoryId === categoryId)
        if(seqNumber > categoryProducts.length){
            return null
        }
        
        return {
            product: categoryProducts[seqNumber],
            categoryLength: categoryProducts.length
        }
    },
    addCategory: (category: string) => {
        categories.push({
            id: categories.length,
            name: category
        })
    },
    addNewProduct: (productData) => {
        products.push(productData)
    },
    isLikeSetted: (username: string, productId: number) => {
        const userLikes = likedProducts.find( (obj) => {
            return obj.username == username
        })

        if(!!userLikes){
            return userLikes.likedProducts.includes(productId)
        }

        return false
    },
    setLike: (username: string, productId: number) => {
        const userLikes = likedProducts.find( (obj) => {
            return obj.username == username
        })

        if(!!userLikes){
            userLikes.likedProducts.push(productId)
        } else {
            likedProducts.push({
                username: username,
                likedProducts: [productId]
            })
        }
    }, 
    unsetLike: (username: string, productId: number) => {
        const userLikes = likedProducts.find( (obj) => {
            return obj.username == username
        })

        if(!!userLikes){
            userLikes.likedProducts = userLikes.likedProducts.filter( el => el !== productId )
        }
    },
    getProductById: (productId: number) => {
        return products.find( item => item.id === productId)
    }
}