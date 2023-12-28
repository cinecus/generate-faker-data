import { faker } from '@faker-js/faker';

// Define interfaces for your data
interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
}

interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
}

interface CustomRandom {
    field: string;
    randomData: any[]
}

interface CustomField {
    field: string
    dataType: 'word' | 'int' | 'float' | 'image' | 'datetime' | 'sentence' | 'color' | 'code'
    from: string | number
    to: string | number
    width: number
    height: number
    size?: number
    prefix?: string
}




// Function to generate a unique product name
function generateUnique(generateFn: Function, setOfNames: Set<string>): string | Error {
    let name: string;
    let retryNumber: number = 0;
    do {
        name = generateFn()
        retryNumber++
        if (retryNumber > 100) {
            throw new Error(`Maximum Data Length around ${setOfNames.size}`)
        }
    } while (setOfNames.has(name)) {
        setOfNames.add(name);
    }

    return name;
}

// Function to add customize random data
function addCustomizeData(customRandom: CustomRandom[] = [], customField: CustomField[] = []) {
    let customObj: any = {}

    customRandom.forEach((el) => {
        customObj[el.field] = faker.helpers.arrayElement(el.randomData)
    })

    customField.forEach((el) => {
        switch (el.dataType) {
            case 'word':
                customObj[el.field] = faker.word.words(el.size)
                break;
            case 'sentence':
                customObj[el.field] = faker.lorem.sentence(el.size)
                break;
            case 'int':
                customObj[el.field] = faker.number.int({ min: el.from as number, max: el.to as number })
                break;
            case 'float':
                customObj[el.field] = faker.number.float({ min: el.from as number, max: el.to as number, precision: 0.01 })
                break;
            case 'color':
                customObj[el.field] = faker.color.rgb()
                break;
            case 'datetime':
                customObj[el.field] = faker.date.between({ from: el.from as string, to: el.to as string })
                break;
            case 'image':
                customObj[el.field] = faker.image.urlLoremFlickr({ width: el.width, height: el.height })
                break;
            default:
                customObj[el.field] = faker.word.words(el.size)
                break;
        }
    })

    return customObj
}

function registCode(prefix = "CODE", int: number) {
    return prefix + int.toString().padStart(5, '0');
}

// Generate fake data
export const generateCategories = (numCategories: number, registerCode: boolean, customRandom: CustomRandom[] = [], customField: CustomField[] = [], seed: number | undefined = undefined): Category[] => {
    try {
        const categories: Category[] = [];
        const categoriesSet: Set<string> = new Set()
        for (let i = 1; i <= numCategories; i++) {

            faker.seed(seed)
            const name = generateUnique(faker.commerce.department, categoriesSet)
            if (name instanceof Error) {
                throw new Error
            }
            const code = registerCode ? registCode("CG", i) : undefined
            categories.push({ id: i, code, name: name, ...addCustomizeData(customRandom, customField) });
        }
        return categories;
    } catch (error) {
        throw error
    }

};

export const generateProducts = (numProducts: number, registerCode: boolean, customRandom: CustomRandom[] = [], customField: CustomField[] = [], seed: number | undefined = undefined): Product[] => {
    const products: Product[] = [];
    const productSet: Set<string> = new Set()
    for (let i = 1; i <= numProducts; i++) {
        faker.seed(seed)
        let name = generateUnique(faker.commerce.productName, productSet)
        if (name instanceof Error) {
            throw new Error
        }
        const code = registerCode ? registCode("PD", i) : undefined
        products.push({
            id: i,
            code,
            name: name,
            price: parseFloat(faker.commerce.price()),
            ...addCustomizeData(customRandom, customField)
        });
    }
    return products;
};

export const generateCustomers = (numCustomers: number, registerCode: boolean, customRandom: CustomRandom[] = [], customField: CustomField[] = [], seed: number | undefined = undefined): Customer[] => {
    const customers: Customer[] = [];
    const firstNameSet: Set<string> = new Set()
    for (let i = 1; i <= numCustomers; i++) {
        faker.seed(seed)
        let firstName = generateUnique(faker.person.firstName, firstNameSet)
        if (firstName instanceof Error) {
            throw new Error
        }
        const code = registerCode ? registCode("CT", i) : undefined
        customers.push({
            id: i,
            code,
            firstName: firstName,
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            address: `${faker.location.streetAddress({ useFullAddress: true })}`,
            ...addCustomizeData(customRandom, customField)
        });
    }
    return customers;
};

export const generateMockups = (numMockup: number, registerCode: boolean, customRandom: CustomRandom[] = [], customField: CustomField[] = [], seed: number | undefined = undefined): any[] => {
    const mockups: any[] = [];
    for (let i = 1; i <= numMockup; i++) {
        faker.seed(seed)
        const code = registerCode ? registCode("MC", i) : undefined
        mockups.push({
            id: i,
            code,
            ...addCustomizeData(customRandom, customField)
        });
    }
    return mockups;
};