(function () {
    function cellText(row, col) {
        var cell = row.cells[col];
        return ((cell && (cell.innerText || cell.textContent)) || "").replace(/\s+/g, " ").trim();
    }

    function parseValue(text, type) {
        if (type === "number") {
            var match = text.match(/\d+/);
            var n = match ? parseInt(match[0], 10) : 0;
            return isNaN(n) ? 0 : n;
        }
        return text.toLowerCase();
    }

    function sortBody(tbody, col, type, dir) {
        var rows = Array.prototype.slice.call(tbody.rows);
        rows.sort(function (a, b) {
            var va = parseValue(cellText(a, col), type);
            var vb = parseValue(cellText(b, col), type);
            if (va < vb) {
                return -1 * dir;
            }
            if (va > vb) {
                return 1 * dir;
            }
            var na = parseValue(cellText(a, 1), "number");
            var nb = parseValue(cellText(b, 1), "number");
            if (na < nb) {
                return 1;
            }
            if (na > nb) {
                return -1;
            }
            return 0;
        });
        var i;
        for (i = 0; i < rows.length; i++) {
            tbody.appendChild(rows[i]);
        }
    }

    function bindTable(table) {
        var tbody = table.tBodies[0];
        var headers = table.tHead.rows[0].cells;
        var currentCol = 0;
        var currentDir = -1;

        function setIndicators(activeCol, dir) {
            var j;
            for (j = 0; j < headers.length; j++) {
                headers[j].className = headers[j].className
                    .replace(/\bsorted-asc\b/g, "")
                    .replace(/\bsorted-desc\b/g, "")
                    .replace(/\s+/g, " ")
                    .trim();
            }
            headers[activeCol].className += dir === 1 ? " sorted-asc" : " sorted-desc";
        }

        function activate(col) {
            var type = headers[col].getAttribute("data-type") || "text";
            if (currentCol === col) {
                currentDir = -currentDir;
            } else {
                currentCol = col;
                currentDir = type === "number" ? -1 : 1;
            }
            sortBody(tbody, col, type, currentDir);
            setIndicators(col, currentDir);
        }

        var i;
        for (i = 0; i < headers.length; i++) {
            (function (col) {
                headers[col].onclick = function () {
                    activate(col);
                };
                headers[col].onkeydown = function (e) {
                    var key = e.key || e.keyCode;
                    if (key === "Enter" || key === " " || key === 13 || key === 32) {
                        if (e.preventDefault) {
                            e.preventDefault();
                        }
                        activate(col);
                    }
                };
            })(i);
        }
    }

    var table = document.getElementById("granted-patents");
    if (table) {
        bindTable(table);
    }
})();
