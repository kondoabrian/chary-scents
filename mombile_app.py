import tkinter as tk
from tkinter import messagebox
window=tk.Tk()
window.title("Mombile Application")
window.geometry("500x500")
window.configure(bg="white")
frame=tk.Frame(pady=70,padx=50,background="black")
def deposit(balance=0):
    depos=int(deposite.get())
    if depos>=5000:
        messagebox.showinfo(f"\nYou have deposited shs:{depos}",
                        f"\r\n Account balance=Shs.{balance+depos}")
    else:
        messagebox.showinfo("Minimum deposit is shs.5000")
def withdraww(balance=0):
    balance=balance+int(deposite.get())
    withdra=int(withdraw.get())
    if balance>withdra and withdra>=2000:
        messagebox.showinfo(f"\nYou have withdrawn shs:{withdra}",
                        f"\r\n Account balance=Shs.{balance-withdra}")
    else:
        messagebox.showinfo("Minimum is shs.2000")
def record(balance=0):
    records.insert(tk.END,f"\nYou deposited shs:{int(deposite.get())}")
    records.insert(tk.END,f"\nYou withdrawn shs:{int(withdraw.get())}")
    records.insert(tk.END,f"\nAccount Balance now is shs:{(balance+int(deposite.get())-int(withdraw.get()))}")

tk.Label(frame,text="Mombile Application",background="black",font=["Arial",15],foreground="red").grid(row=0,column=1,pady=10)
Account_balance=0
tk.Label(frame,text=f"Account Balance is: {Account_balance}",background="black",font=["Arial",14],foreground="yellow").grid(row=1,column=1,pady=10)
tk.Label(frame,text="Enter Deposit",background="black",font=["Arial",12],foreground="yellow").grid(row=2,column=0)
deposite=tk.Entry(frame,font=["Arial",17],width=20)
deposite.grid(row=2,column=1)
tk.Button(frame,text="Deposit",command=deposit,background="cyan",foreground="red",width=10,height=1,padx=8,pady=8).grid(row=3,column=1,pady=10)
tk.Label(frame,text="Enter Withdraw",background="black",font=["Arial",12],foreground="yellow").grid(row=4,column=0)
withdraw=tk.Entry(frame,font=["Arial",17],width=20)
withdraw.grid(row=4,column=1)
tk.Button(frame,text="Withdraw",command=withdraww,background="cyan",foreground="red",width=10,height=1,padx=8,pady=8).grid(row=5,column=1,pady=10)
tk.Button(frame,text="Records",command=record,background="purple",foreground="yellow",width=10,height=1,padx=8,pady=8).grid(row=5,column=0,pady=10)
records=tk.Text(frame,width=50,height=10,pady=10,foreground="yellow",background="black",padx=5,font=["Arial",15])
records.grid(row=6,column=1)



frame.pack(pady=50,padx=50)
window.mainloop()