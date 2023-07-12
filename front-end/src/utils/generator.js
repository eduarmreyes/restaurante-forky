/*
Util obj to share possible common functions


*/
const generator = {
    /* 
    Returns the status of the reservation
    parameters: current <- current status
    */
    changeStatus: function(current){
        switch (current) {
            case generator.status.BOOKED:
                return generator.status.SEATED
            case generator.status.SEATED:
                return generator.status.FINISHED
            default: return generator.status.BOOKED      
        }
    },
    status: {
        BOOKED: 'booked',
        SEATED: 'seated',
        FINISHED: 'finished'
    }

}

export default generator;