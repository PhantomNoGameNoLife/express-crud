/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function (strs) {
    let prefix = strs[0];
    for (let i = 1; i < strs.length; i++) {
        // check if others word starts with this prefix if not remove the last character from it and try again
        while (strs[i].indexOf(prefix) !== 0) {
            prefix = prefix.slice(0, -1);
            if (prefix === "") return "";
        }
    }
    return prefix;
};


// console.log(longestCommonPrefix(["flower", "flow", "flight"])) // fl
// console.log(longestCommonPrefix(["dog", "racecar", "car"])) // ""
// console.log(longestCommonPrefix(["cat", "car", "cow"])) //c
// console.log(longestCommonPrefix(["when", "who", "what"])) //wh