(() => {

    const fullNameColumnName = 'ФИО';
    const facultyColumnName = 'Факультет';
    const dateOfBirthColumnName = 'Дата рождения (возраст)';
    const yearsOfEducationColumnName = 'Годы обучения (номер курса)'; 

    const columnNames = [fullNameColumnName, facultyColumnName, dateOfBirthColumnName, yearsOfEducationColumnName];
    const currentDate = new Date();
    const students = []; 

    const dateOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    };

    let errorMessages = [];
    const errorMessagesDiv = getElement('validationErrors');
   
    function getElement(id) {
        return document.getElementById(id);
    }

    function getInputValue(id) {                    
        return getElement(id).value.trim();
    }

    function createTh(columnName) {
        const th  = document.createElement('th');        
        th.setAttribute('scope', 'col');        
        th.textContent = columnName;

        th.addEventListener('click', function() {        
            updateTable(sortStudents(columnName))
        })

        return th;
    }

    function sortStudents(columnName) {
        if (columnName === dateOfBirthColumnName) {
            return sortByDateofBirth();        
        }
        else if (columnName === yearsOfEducationColumnName) {
            return sortByYear();
        }
        else if (columnName === fullNameColumnName) {
            return sortByName();
        }
        else if (columnName === facultyColumnName) {
            return sortByFaculty();
        }
        else {
            alert(`Невозможно отсортировать по колонке ${columnName}.`);
        }
    }

    function sortByDateofBirth() {        
        return students.slice(0).sort(function(firstStudent, secondStudent) {
            return firstStudent.dateOfBirth - secondStudent.dateOfBirth
       });
    }

    function sortByYear() {
        return students.slice(0).sort(function(firstStudent, secondStudent) {
            return firstStudent.yearOfAdmission - secondStudent.yearOfAdmission
       });
    }

    function sortByName() {
        return students.slice(0).sort(function(firstStudent, secondStudent) {
            return firstStudent.fullName().localeCompare(secondStudent.fullName())
       });
    }

    function sortByFaculty() {
        return students.slice(0).sort(function(firstStudent, secondStudent) {
            return firstStudent.faculty.localeCompare(secondStudent.faculty)
       });
    }  
   
    function createThead() {
        const thead = document.createElement('thead');
        thead.classList.add('thead-dark');
        const tr  = document.createElement('tr');
        
        for (let columnName of columnNames) {
            tr.append(createTh(columnName));
        }

        thead.append(tr);
        
        return thead;
    }

    function createTd(value) {
        const td  = document.createElement('td');        
        td.setAttribute('scope', 'col');        
        td.textContent = value;

        return td;
    }

    function createTbody(students) {
        const tbody = document.createElement('tbody');        
       
        if (students) {
            for (let student of students) {
                const tr  = document.createElement('tr');
                
                tr.append(createTd(student.fullName()));            
                tr.append(createTd(student.faculty));

                const birthDate = student.dateOfBirth.toLocaleString("ru", dateOptions);
                tr.append(createTd(`${birthDate} (${student.getAge()})`));

                tr.append(createTd(`${student.yearOfAdmission} - ${student.yearOfGraduation()} (${student.course()})`));

                tbody.append(tr);          
            }
        }

        return tbody;
    }

    function createTable() {
        const table = document.createElement('table');        
        table.classList.add('table', 'table-striped', 'table-bordered');   
        table.append(createThead());
        table.append(createTbody());

        return table;
    }   

    function validateNotEmpty(value, fieldName) {        
        if (!value) {
            errorMessages.push(`Заполните поле ${fieldName}.`);
            displayErrorMessages();
        }

        return value ? true : false;
    }

    function validateDateInRange(date, lowerBound, upperBound, fieldName) { 
        const isInRange = date >= lowerBound && date <= upperBound;
        
        if (date && !isInRange) {           
            const lowerBoundString = lowerBound.toLocaleString("ru", dateOptions);
            const upperBoundString = upperBound.toLocaleString("ru", dateOptions);
            errorMessages.push(`Поле ${fieldName} должно находится в диапазоне от ${lowerBoundString} до ${upperBoundString}.`);
            displayErrorMessages();
        }
    }   
    
    function validateNumberInRange(number, lowerBound, upperBound, fieldName) { 
        const isInRange = number >= lowerBound && number <= upperBound;
        
        if (number && !isInRange) {       
            errorMessages.push(`Поле ${fieldName} должно находится в диапазоне от ${lowerBound} до ${upperBound}.`);
            displayErrorMessages();
        }
    }      

    function createStudent(name, surname, middlename, dateOfBirth, yearOfAdmission, faculty) {
        let student = {
            name, 
            surname, 
            middlename,
            fullName : function() {
                return `${this.surname} ${this.name} ${this.middlename}`;
            },
            dateOfBirth,
            getAge() {
                let millisecondsAge = currentDate.getTime() - this.dateOfBirth.getTime();
                return Math.floor(millisecondsAge / 1000 / 60 / 60 / 24 / 365.25);  
            }, 
            yearOfAdmission,
            yearOfGraduation : function() {
                return this.yearOfAdmission + 4;
            },
            faculty,
            course : function() {
                return currentDate.getFullYear() > student.yearOfGraduation()
                    ? 'закончил'
                    : `${currentDate.getFullYear() - student.yearOfAdmission} курс`;
            }
        };
        
        return student;        
    }

    function displayErrorMessages() {
        if (errorMessages.length != 0) {
            errorMessagesDiv.innerHTML = errorMessages.join("<br>");
        } else {
            errorMessagesDiv.innerHTML = '';
        }        
    }

    function onFormSubmit(e) {
        e.preventDefault();      
        errorMessages = [];
        displayErrorMessages();
        
        const name = getInputValue('inputName');
        const surname = getInputValue('inputSurname');
        const middlename = getInputValue('inputMiddlename');
        const dateOfBirthString = getInputValue('inputDateOfBirth');             
        const yearOfAdmission = parseInt(getInputValue('inputYearOfAdmission'));
        const faculty = getInputValue('inputFaculty');
         

        validateNotEmpty(name, "'Имя'");
        validateNotEmpty(surname, "'Фамилия'");
        validateNotEmpty(middlename, "'Отчество'");

        const isDateNotEmpty = validateNotEmpty(dateOfBirthString, "'Дата рождения'");
        validateNotEmpty(yearOfAdmission, "'Год поступления'");

        validateNotEmpty(faculty, "'Факультет'");


        const dateOfBirth = isDateNotEmpty ? new Date([dateOfBirthString]) : null;
        validateDateInRange(dateOfBirth, new Date('1900-01-01'), currentDate, "'Дата рождения'");
          
        validateNumberInRange(yearOfAdmission, 2000, currentDate.getFullYear(), "'Год поступления'");

        if (errorMessages.length == 0) {
            getElement('studentForm').reset();
            
            const student = createStudent(name, surname, middlename, dateOfBirth, yearOfAdmission, faculty);
            students.push(student);

            updateTable(students);
        } 
    }  

    function onSearchFormSubmit(e) {
        e.preventDefault();       

        const searchFilterName = getInputValue('filterName');
        const searchFilterFaculty = getInputValue('filterFaculty');
        const searchFilterYearOfAdmission = parseInt(getInputValue('filterYearOfAdmission'));
        const searchFilterYearOfGraduation = parseInt(getInputValue('filterYearOfGraduation'));

        let filteredStudents = students.filter(student => {
                return isStudentExist(student, 'fullName', searchFilterName);
            })
            .filter(student => {
                return isStudentExist(student, 'faculty', searchFilterFaculty);
            })
            .filter(student => {
                return isStudentExist(student, 'yearOfAdmission', searchFilterYearOfAdmission);
            })
            .filter(student => {
                return isStudentExist(student, 'yearOfGraduation', searchFilterYearOfGraduation);
            })

        updateTable(filteredStudents);
    }    

    function isStudentExist(student, property, value) {
            if (!value) {
                return true;
            }

            let propertyValue = typeof student[property] === 'function'
                ? student[property]()
                : student[property];

            if (typeof value === 'number') {
                return propertyValue === value;
            } 
            else if (typeof value === 'string') {
                return propertyValue.toLowerCase().includes(value.toLowerCase());
            } 
            else {
                alert(`Тип '${typeof value}' не поддерживается.`);
            }
    }

    function resetFilter() {              
        updateTable(students);
    }

    function updateTable(students) {
        document.querySelector('tbody').replaceWith(createTbody(students));
    }

    function createStudentManagementPanel(container) {
        const table = createTable();
        container.append(table);
        
        const form = getElement('studentForm');
        form.addEventListener('submit', onFormSubmit);

        const searchForm = getElement('searchFilter');
        searchForm.addEventListener('submit', onSearchFormSubmit);

        const resetFilterButton = getElement('resetFilter');
        resetFilterButton.addEventListener('click', resetFilter);
    }

    window.createStudentManagementPanel = createStudentManagementPanel;
})();
