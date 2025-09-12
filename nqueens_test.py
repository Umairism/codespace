def solve_nqueens(n: int):
    solutions = []
    board = [-1] * n

    def is_safe(row, col):
        for r in range(row):
            c = board[r]
            if c == col or abs(c - col) == abs(r - row):
                return False
        return True

    def backtrack(row=0):
        if row == n:
            solutions.append(board[:])
            return
        for col in range(n):
            if is_safe(row, col):
                board[row] = col
                backtrack(row + 1)
                board[row] = -1

    backtrack()
    return solutions

if __name__ == "__main__":
    n = 8
    sols = solve_nqueens(n)
    result = {
        "n": n,
        "total_solutions": len(sols),
        "first_solution": sols[0] if sols else None
    }
    print(result)   # force output
    result          # still return for interpreter logging
