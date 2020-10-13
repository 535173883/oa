let clear_f = (value) => {
    for (var item in value) {

        value[item] = ""
        if (Array.isArray(value[item])) {
            value[item] = [];
        }

    }
};

export {
    clear_f,
}
