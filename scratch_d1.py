import base64
code = """def fib(n):
    if n == 0:
        return
    num1 = 0
    num2 = 1
    if n == 1:
        print(num1)
        return
    print(num1, num2, end=" ")
    count = 2
    while count < n:
        next_number = num1 + num2
        print(next_number, end=" ")
        count += 1
        num1, num2 = num2, next_number

n = int(input("enter the Limit: "))
fib(n)
print()"""
inputs = ['10']
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
