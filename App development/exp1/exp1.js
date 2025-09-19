const prompt = require('prompt-sync')({ sigint: true });
    
    let arr = [];
    let userChoice = '';
    
    while (userChoice !== '5') {
        
        
        console.log('1. create (add an item)');
        console.log('2. read (view all items)');
        console.log('3. update (modify an item)');
        console.log('4. delete (remove an item)');
        console.log('5. exit');
    
        userChoice = prompt('enter your choice: ');
    
        switch (userChoice) {
            case '1':
                
                const b= prompt('enter the item to add: ');
                arr.push(b);
                console.log('${b}',' has been added');
                break;
    
            case '2':
                
                if (arr.length === 0) {
                    console.log('the array is empty.');
                } else {
                    console.log('\ncurrent array items');
                    arr.forEach((item, index) => {
                        console.log(`${index}: ${item}`);
                    });
                }
                break;
    
            case '3':
                
                if (arr.length > 0) {
                    const a = prompt('enter the index of the item to update: ');
                    const newUpdateValue = prompt('enter the new value: ');
                    if (a >= 0 && a < arr.length) {
                        arr[a] = newUpdateValue;
                        console.log('item updated successfully.');
                    } else {
                        console.log('invalid index.');
                    }
                } else {
                    console.log('the array is empty');
                }
                break;
    
            case '4':
                
                if (arr.length > 0) {
                    const deleteIndex = prompt('enter the index of the item to delete: ');
                    if (deleteIndex >= 0 && deleteIndex < arr.length) {
                        arr.splice(deleteIndex, 1);
                        console.log('item deleted successfully.');
                    } else {
                        console.log('invalid index.');
                    }
                } else {
                    console.log('the array is empty');
                }
                break;
    
            case '5':
                
                console.log('exiting program.');
                break;
    
            default:
                console.log('invalid choice');
        }
    }