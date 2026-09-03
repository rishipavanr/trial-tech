import base64
code = """num1 = int(input("Enter first number: "))
num2 = int(input("Enter second number: "))

print("Printing the result for all arithmetic operations:-")
print("Addition: ", num1+num2)
print("Subtraction: ", num1-num2)
print("Multiplication: ", num1*num2)
if num2 != 0:
    print("Division: ", num1/num2)
    print("Modulus: ", num1%num2)
else:
    print("Division: Cannot divide by zero")
    print("Modulus: Cannot divide by zero")"""
inputs = ['10', '3']
import builtins
i = iter(inputs)
def c_i(p=''):
    print(p, end='')
    val = next(i)
    print(val)
    return str(val)
builtins.input = c_i
import io, sys
old_out = sys.stdout
sys.stdout = io.StringIO()
exec(code)
out = sys.stdout.getvalue()
sys.stdout = old_out
print(base64.b64encode(out.encode()).decode())
