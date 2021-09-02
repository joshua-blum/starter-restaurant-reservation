const compare = (left,right) => {return left-right};


const partition = (
    compare,
    elements,
    lowerIndex,
    upperIndex
    ) => {
    const pivotValue = elements[upperIndex];
    let partitionIndex = lowerIndex;

    for(let i=lowerIndex; i < upperIndex; i++){
        const comparison = compare(pivotValue, elements[i]);
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


export default function quickSort (
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



