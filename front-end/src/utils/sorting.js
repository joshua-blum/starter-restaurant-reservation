export function compare (left,right) {
    console.log("comparing left vs right: ", left>right);
    console.log(`here is left: ${left}, and here is right: ${right}`);
    return left > right;
};


const partition = (
    compare,
    elements,
    lowerIndex,
    upperIndex
    ) => {
    const pivotValue = elements[upperIndex].reservation_time;
    let partitionIndex = lowerIndex;

    for(let i=lowerIndex; i < upperIndex; i++){
        const comparison = compare(pivotValue, elements[i].reservation_time);
        if(comparison > 0){
            if(partitionIndex !== i){
                //swap the positions of the current index element with the pivot element
                [elements[i], elements[partitionIndex]] = [elements[partitionIndex], elements[i]]
            }
            partitionIndex++;
        }
    }
    [elements[partitionIndex], elements[upperIndex]] = [elements[upperIndex], elements[partitionIndex]];
    return partitionIndex;
}


export function quickSort (
    compare,
    elements,
    lowerIndex = 0,
    upperIndex = elements.length-1
    ){
    //recursion
    if(lowerIndex < upperIndex){
        const index = partition(compare, elements, lowerIndex, upperIndex);
        quickSort(compare,elements,lowerIndex,index-1);
        quickSort(compare, elements,index+1,upperIndex);
    }

    //base case
    return elements;
}


/**
 * 
 * form of data:
 * {
    "first_name": "Frank",
    "last_name": "Palicky",
    "mobile_number": "202-555-0153",
    "reservation_date": "2020-12-30",
    "reservation_time": "20:00",
    "people": 1,
    "created_at": "2020-12-10T08:31:32.326Z",
    "updated_at": "2020-12-10T08:31:32.326Z"
  },
 * 
 */

