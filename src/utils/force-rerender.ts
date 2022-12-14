let keyIncrement = 0;
export default function force_rerender() {
    keyIncrement++
    console.log('force', keyIncrement)

}

export { keyIncrement } 
