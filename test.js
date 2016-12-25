import test from 'ava'
import ssl from './ssl'
test('python hello world', async t => {
  const p = ssl({
    source_code: 'print("hello world")',
    langauge: 'python3'
  })
  const stdout = await p
  t.is(stdout, 'hello world\n')
})

test('python A+B', async t => {
  const p = ssl({
    source_code: 'print(int(input())+int(input()))',
    langauge: 'python3',
    stdin: '1010\n101'
  })
  const stdout = await p
  t.is(stdout, '1111\n')
})

test('java runnable', async t => {
  const p = ssl({
    source_code: `public class supreme{
      public static void main(String[] args){
        Runnable r = () -> System.out.print("Hello world from thread");
        Thread t = new Thread(r);
        t.start();
        try {
          t.join();
        } catch (Exception e) {
          
        }
        
      }
    }`,
    langauge: 'java'
  })
  const stdout = await p
  t.is(stdout, 'Hello world from thread')
})
