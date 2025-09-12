# Python Advanced Features Demo
print("=== Advanced Python Features Test ===")

# 1. Lists and list operations
numbers = [1, 2, 3, 4, 5]
print("Original list:", numbers)
numbers.append(6)
print("After append:", numbers)
numbers.reverse()
print("After reverse:", numbers)
print("List length:", len(numbers))

# 2. Dictionaries
person = {"name": "Alice", "age": 30, "city": "New York"}
print("Person:", person)
print("Keys:", person.keys())
print("Values:", person.values())
print("Items:", person.items())
print("Name:", person.get("name"))

# 3. Function definition and call
def greet(name):
    print(f"Hello, {name}!")
    return f"Greeting sent to {name}"

result = greet("World")
print("Function result:", result)

# 4. Class definition
class Dog:
    def __init__(self, name):
        self.name = name
        self.age = 0
    
    def bark(self):
        print(f"{self.name} says Woof!")
    
    def get_age(self):
        return self.age

# 5. Object instantiation
my_dog = Dog("Buddy")
print("Created dog:", my_dog)
print("Dog type:", type(my_dog))

# 6. Boolean and None values
is_active = True
is_deleted = False
data = None
print("Active:", is_active)
print("Deleted:", is_deleted)
print("Data:", data)
print("Data type:", type(data))

# 7. For loop with range
print("Counting:")
for i in range(3):
    print(f"Count: {i}")

# 8. Complex expressions
result = 10 + 5 * 2
print("Math result:", result)

print("=== Test Complete ===")
