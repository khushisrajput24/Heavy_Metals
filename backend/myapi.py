from fastapi import FastAPI, Path
from typing import Optional
from pydantic import BaseModel

app = FastAPI()

students = {
    1: {"name": "Alice", "age": 20, "major": "Computer Science"},
    2: {"name": "Bob", "age": 22, "major": "Mathematics"},
    3: {"name": "Charlie", "age": 21, "major": "Physics"},
}

class Student(BaseModel):
    name: str
    age: int
    major: str

class UpdateStudent(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    major: Optional[str] = None

@app.get("/cal-api")
def calculate(a: int, b: int):
    return {
        "sum": a + b,
        "difference": a - b,
        "product": a * b,
        "quotient": a / b if b != 0 else None
    }

@app.get("/students")
def get_all_students():
    return students

@app.get("/students/{student_id}")
def get_student(student_id: int = Path(..., description="The ID of the student to retrieve", gt=0)):
    student = students.get(student_id)
    if student:
        return student
    return {"error": "Student not found"}

@app.post("/students")
def add_student(student: Student):
    new_id = max(students.keys()) + 1
    students[new_id] = student.dict()
    return {"id": new_id, "student": students[new_id]}

@app.put("/students/{student_id}")
def update_student(student_id: int, student: UpdateStudent):
    existing_student = students.get(student_id)
    if not existing_student:
        return {"error": "Student not found"}
    
    updated_data = student.dict(exclude_unset=True)
    existing_student.update(updated_data)
    return {"id": student_id, "student": existing_student}

@app.delete("/students/{student_id}")
def delete_student(student_id: int):
    if student_id in students:
        del students[student_id]
        return {"message": "Student deleted successfully"}
    return {"error": "Student not found"}